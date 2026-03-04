import PickupModel from '../models/Pickup.model.js';
import userModel from '../models/user.model.js';

export const paymentService = {
    releasePayment: async (pickupId: string, compositeScore: number) => {
        // Calculate kabadiwalla amount
        let base = 12;
        let kabadiwalaAmount = 0;

        if (compositeScore >= 90) kabadiwalaAmount = base * 1.2;
        else if (compositeScore >= 70) kabadiwalaAmount = base * 1.0;
        else if (compositeScore >= 50) kabadiwalaAmount = base * 0.8;
        else kabadiwalaAmount = base * 0.6;

        // Calculate citizen cashback
        let cashbackBase = 4;
        let cashbackAmount = 0;

        if (compositeScore >= 70) cashbackAmount = cashbackBase * 1.0;
        else if (compositeScore >= 50) cashbackAmount = cashbackBase * 0.7;
        else cashbackAmount = 0;

        const pickup = await PickupModel.findById(pickupId);
        if (!pickup) throw new Error("Pickup not found");

        pickup.paymentAmount = kabadiwalaAmount;
        pickup.cashbackAmount = cashbackAmount;
        pickup.paymentStatus = 'released';
        await pickup.save();

        // In a real app we would use Razorpay Payout API here to transfer the funds to KabadiwalaWallet
        console.log(`[PaymentService] Released payment. Kabadiwala: ${kabadiwalaAmount}, Citizen: ${cashbackAmount}`);

        // Assuming adding amount to user wallet
        if (cashbackAmount > 0) {
            await userModel.findByIdAndUpdate(pickup.citizenId, {
                $inc: { 'citizenProfile.cashbackBalance': cashbackAmount }
            });
        }

        return { kabadiwalaAmount, cashbackAmount };
    },

    weeklyPayout: async (kabadiwalaId: string) => {
        // Stub for weekly payout logic
        console.log(`[PaymentService] Executing weekly payout for kabadiwala ${kabadiwalaId}`);
        return true;
    },

    citizenWithdrawal: async (citizenId: string, amountINR: number) => {
        // Stub for citizen withdrawal
        console.log(`[PaymentService] Executing citizen withdrawal for citizen ${citizenId} amount ${amountINR}`);
        const user = await userModel.findById(citizenId);
        if (user && user.citizenProfile && user.citizenProfile.cashbackBalance >= amountINR) {
            user.citizenProfile.cashbackBalance -= amountINR;
            await user.save();
            return true;
        }
        return false;
    }
};
