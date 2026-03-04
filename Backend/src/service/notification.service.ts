import { UserModel } from '../models/User.model';

export class NotificationService {
    /**
     * Sends a push notification to a specific user via Expo or Firebase.
     * Used by agents and other services.
     */
    static async sendPush(userId: string, title: string, body: string, data?: any): Promise<boolean> {
        const user = await UserModel.findById(userId);
        if (!user) return false;

        // In a real application, you'd extract the expoPushToken from the user model 
        // and send the request to the Expo backend here.
        console.log(`[PUSH -> User ${userId}]: ${title} - ${body}`);

        // Simulate successful push
        return true;
    }
}
