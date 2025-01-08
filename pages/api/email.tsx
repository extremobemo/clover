import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { data } = req.body;
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }
        
        const client = new MongoClient(mongoUri);

        try {
            await client.connect();

            const db = client.db("Clover");
            const collection = db.collection("pre_release_emails");

            const result = await collection.insertOne({
                email: data,
                timestamp: new Date(),
            });
            res.status(200).json({ message: "Email successfully saved", id: result.insertedId });
        }
        catch (error) {
            console.error("Error saving email:", error);
            res.status(500).json({ message: "Internal server error" });
        }
        finally {
            await client.close(); // Ensure the connection is closed
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed!" });
    }

}

export default handler;
