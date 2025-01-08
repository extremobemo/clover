import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import Joi from "joi";

// Email validation schema
const emailSchema = Joi.string().email().required();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { data } = req.body;
        const email: string = data.toLowerCase();

        // Validate email using Joi
        const { error } = emailSchema.validate(email);
        if (error) {
            return res.status(400).json({ message: "Oops, the format of the email you entered was invalid. Refresh the page and try again." });
        }

        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }

        const client = new MongoClient(mongoUri);

        try {
            await client.connect();

            const db = client.db("Clover");
            const collection = db.collection("pre_release_emails");

            //check to see if email already exists
            // Check to see if the email already exists
            const existingEmail = await collection.findOne({ email: email });

            if (existingEmail) {
                // Email already exists, return a response to the client
                return res.status(200).json({ message: "We've already got that email. See you soon.", exists: true });
            }

            const result = await collection.insertOne({
                email: email,
                timestamp: new Date(),
            });
            res.status(200).json({ message: "Your email was submitted succesfully. See you soon.", id: result.insertedId });
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
