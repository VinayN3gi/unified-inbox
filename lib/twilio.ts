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
    const from =
      channel === "WHATSAPP"
        ? process.env.TWILIO_WHATSAPP_NUMBER
        : process.env.TWILIO_PHONE_NUMBER;

    const formattedTo =
      channel === "WHATSAPP" ? `whatsapp:${to}` : to;

    const message = await client.messages.create({
      from,
      to: formattedTo,
      body,
      ...(mediaUrl ? { mediaUrl: [mediaUrl] } : {}),
    });

    return message;
  },
};
