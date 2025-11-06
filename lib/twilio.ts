// /lib/twilio.ts
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

export type ChannelType = "SMS" | "WHATSAPP";

export const TwilioClient = {
  sendMessage: async ({
    to,
    body,
    mediaUrl,
    channel,
  }: {
    to: string;
    body: string;
    mediaUrl?: string;
    channel: ChannelType;
  }) => {
    try {
      const from =
        channel === "WHATSAPP"
          ? process.env.TWILIO_WHATSAPP_NUMBER
          : process.env.TWILIO_PHONE_NUMBER;

      if (!from) throw new Error(`Missing FROM number for ${channel}`);

      const message = await client.messages.create({
        from,
        to: channel === "WHATSAPP" ? `whatsapp:${to}` : to,
        body,
        ...(mediaUrl ? { mediaUrl: [mediaUrl] } : {}),
      });

      return message;
    } catch (error: any) {
      console.error("❌ Twilio send error:", error.message);
      throw new Error(error.message);
    }
  },
};
