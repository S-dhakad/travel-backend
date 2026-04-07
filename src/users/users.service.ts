import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {
  RegisterUserDto,
  LoginDto,
  UpdateProfileDto,
  GetProfileDto,
  ChangePasswordDto,
} from './dto/user.dto';
import { UserRole } from './enums/user-role.enum';
import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/type/response.type';
import { SettingService } from '../setting/setting.service';
import { S3UploadService } from '../common/services/s3.service';
import { MessagingService } from '../common/messaging/messaging.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private responseService: ResponseService,
    private jwtService: JwtService,
    private settingService: SettingService,
    private s3UploadService: S3UploadService,
    private messagingService: MessagingService,
  ) { }

  async register(registerDto: RegisterUserDto): Promise<ApiResponse> {
    const { mobileNumber, fullName, email, password, location, role, gender, dob, profileImage } = registerDto;

    const existingUser = await this.userModel.findOne({ mobileNumber });
    if (existingUser) {
      return this.responseService.badRequest('User with this mobile number already exists.');
    }

    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      return this.responseService.badRequest('Email already exists');
    }

    const requestedRole = role || UserRole.USER;

    const newUser = new this.userModel({
      mobileNumber,
      fullName,
      email,
      password, // Note: In a production app, always hash this password
      role: requestedRole,
      location: location || undefined,
      gender: gender || undefined,
      dob: dob ? new Date(dob) : undefined,
      profileImage: profileImage || undefined,
    });

    await newUser.save();
    newUser.createBy = newUser._id;
    await newUser.save();

    const payload = {
      sub: newUser._id.toString(),
      mobileNumber: newUser.mobileNumber,
      role: newUser.role,
    };
    const token = this.jwtService.sign(payload);

    return this.responseService.success('User registered successfully', {
      token,
      user: {
        userId: newUser._id.toString(),
        mobileNumber: newUser.mobileNumber,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        location: newUser.location,
        gender: newUser.gender,
        dob: newUser.dob,
        profileImage: newUser.profileImage,
        lastLogin: (newUser as any).lastLogin || null,
      }
    });
  }

  async login(loginDto: any): Promise<ApiResponse> {
    const email = (loginDto?.email || '').trim();
    const password = loginDto?.password || '';

    if (!email || !password) {
      return this.responseService.badRequest('Email and password are required.');
    }

    // Find user by email OR mobile number
    const user = await this.userModel.findOne({
      $or: [
        { email: email.toLowerCase() },
        { email: email },
        { mobileNumber: email },
      ]
    });

    if (!user) {
      return this.responseService.notFound('No account found with this email.');
    }

    if (user.password !== password) {
      return this.responseService.badRequest('Incorrect password. Please try again.');
    }

    (user as any).lastLogin = new Date();
    await user.save();

    const payload = {
      sub: user._id.toString(),
      mobileNumber: user.mobileNumber,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return this.responseService.success('Login successful', {
      token,
      user: {
        userId: user._id.toString(),
        mobileNumber: user.mobileNumber,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        location: user.location,
        gender: user.gender,
        dob: user.dob,
        profileImage: user.profileImage,
        lastLogin: (user as any).lastLogin || null,
      },
    });
  }

  async getProfile(getProfileDto: GetProfileDto, req: any): Promise<ApiResponse> {
    const user = await this.userModel.findById(req.user.userId).select('-password');
    if (!user) return this.responseService.notFound('User not found');
    return this.responseService.success('Profile retrieved', {
      userId: user._id.toString(),
      mobileNumber: user.mobileNumber,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      location: user.location,
      gender: user.gender,
      dob: user.dob,
      profileImage: user.profileImage,
      lastLogin: (user as any).lastLogin || null,
    });
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, req: any): Promise<ApiResponse> {
    const user = await this.userModel.findById(req.user.userId);
    if (!user) return this.responseService.notFound('User not found');

    const { fullName, email, password, location, gender, dob, profileImage } = updateProfileDto;
    if (fullName) user.fullName = fullName;
    if (email && email !== user.email) {
      if (await this.userModel.findOne({ email })) return this.responseService.badRequest('Email exists');
      user.email = email;
    }
    if (password) user.password = password;
    if (location) user.location = location;
    if (gender) user.gender = gender;
    if (dob) user.dob = new Date(dob);
    if (profileImage) user.profileImage = profileImage;

    user.updatedBy = new Types.ObjectId(req.user.userId);
    await user.save();
    return this.getProfile({}, req);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, req: any): Promise<ApiResponse> {
    const user = await this.userModel.findById(req.user.userId);
    if (!user) return this.responseService.notFound('User not found');

    const { oldPassword, newPassword } = changePasswordDto;

    // Verify old password
    if (user.password !== oldPassword) {
      return this.responseService.badRequest('Old password does not match.');
    }

    if (oldPassword === newPassword) {
      return this.responseService.badRequest('New password cannot be the same as old password.');
    }

    user.password = newPassword;
    user.updatedBy = new Types.ObjectId(req.user.userId);
    await user.save();

    return this.responseService.success('Password updated successfully');
  }

  async uploadFile(buffer: Buffer | undefined, name: string | undefined, mime: string | undefined, folder: string = 'images'): Promise<ApiResponse> {
    if (!buffer || !name || !mime) return this.responseService.badRequest('Missing file data');
    try {
      const result = await this.s3UploadService.uploadFile(buffer, name, mime, folder);
      return this.responseService.success('Uploaded', { url: result.url, key: result.key, size: buffer.length, mimetype: mime });
    } catch (e: any) {
      return this.responseService.error('Upload failed', e.message);
    }
  }
}
