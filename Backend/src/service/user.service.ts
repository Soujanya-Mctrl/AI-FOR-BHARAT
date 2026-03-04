import { PickupRequestModel } from '../models/PickupRequest.model';
import { IUserDocument, UserModel } from '../models/User.model';
import { ApiError } from '../utils/ApiError';

export class UserService {
    static async getProfile(userId: string): Promise<IUserDocument> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found.');
        }
        return user;
    }

    static async updateProfile(userId: string, updateData: Record<string, any>): Promise<IUserDocument> {
        const user = await UserModel.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            throw new ApiError(404, 'User not found.');
        }
        return user;
    }

    static async getPickupHistory(userId: string): Promise<any[]> {
        // Find pickups where the user is either the citizen or the kabadiwalla
        const pickups = await PickupRequestModel.find({
            $or: [{ citizenId: userId }, { kabadiwallaId: userId }]
        }).sort({ createdAt: -1 });

        return pickups;
    }
}
