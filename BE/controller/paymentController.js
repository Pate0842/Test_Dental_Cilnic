import crypto from "crypto";
import https from "https";

export const createPayment = async (req, res) => {
    try {
        const { amount, orderInfo } = req.body;

        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const redirectUrl = process.env.MOMO_REDIRECT_URL;
        const ipnUrl = process.env.MOMO_IPN_URL;
        const requestType = "payWithMethod";
        const orderId = partnerCode + Date.now();
        const requestId = orderId;

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = JSON.stringify({
            partnerCode,
            partnerName: "Your Business Name",
            storeId: "YourStoreId",
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang: "vi",
            requestType,
            autoCapture: true,
            extraData: "",
            signature,
        });

        const options = {
            hostname: "test-payment.momo.vn",
            port: 443,
            path: "/v2/gateway/api/create",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
            },
        };

        const reqMoMo = https.request(options, (moMoRes) => {
            let data = "";

            moMoRes.on("data", (chunk) => {
                data += chunk;
            });

            moMoRes.on("end", () => {
                const response = JSON.parse(data);
                res.status(200).json(response);
            });
        });

        reqMoMo.on("error", (e) => {
            console.error(`Problem with request: ${e.message}`);
            res.status(500).json({ error: "Failed to create payment" });
        });

        reqMoMo.write(requestBody);
        reqMoMo.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

export const handleIPN = async (req, res) => {
    try {
        const { orderId, resultCode } = req.body;

        if (resultCode === 0) {
            console.log(`Order ${orderId} was successful.`);
            // Cập nhật trạng thái đơn hàng vào cơ sở dữ liệu
        } else {
            console.log(`Order ${orderId} failed with resultCode ${resultCode}.`);
            // Xử lý giao dịch thất bại nếu cần
        }

        res.status(200).json({ message: "IPN received" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};