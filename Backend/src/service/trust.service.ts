import { IKabadiwallaTrustScoreDocument, KabadiwallaTrustScoreModel } from '../models/KabadiwallaTrustScore.model';
import { UserModel } from '../models/User.model';

export class TrustService {
    static async getTrustScore(kabadiwallaId: string): Promise<IKabadiwallaTrustScoreDocument> {
        let scoreDoc = await KabadiwallaTrustScoreModel.findOne({ kabadiwallaId });

        // Initialize if not exists
        if (!scoreDoc) {
            scoreDoc = await KabadiwallaTrustScoreModel.create({
                kabadiwallaId,
                score: 50,
                history: [{ reason: 'Initial Score Assignment', oldScore: 50, newScore: 50 }]
            });
        }

        return scoreDoc;
    }

    static async adjustScore(kabadiwallaId: string, amount: number, reason: string): Promise<number> {
        const scoreDoc = await this.getTrustScore(kabadiwallaId);

        const oldScore = scoreDoc.score;
        let newScore = oldScore + amount;

        // Clamp to 0-100 bounds
        newScore = Math.max(0, Math.min(100, newScore));

        scoreDoc.score = newScore;
        scoreDoc.history.push({
            reason,
            oldScore,
            newScore,
            changedAt: new Date()
        });

        await scoreDoc.save();

        // Denormalize/mirror onto User for quick reads
        await UserModel.findByIdAndUpdate(kabadiwallaId, { trustScore: newScore });

        return newScore;
    }
}
