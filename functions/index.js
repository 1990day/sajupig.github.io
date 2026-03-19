const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const axios = require("axios");

// 주의: 따옴표 안쪽에 본인의 토스페이먼츠 라이브 시크릿 키를 넣으세요!
const TOSS_SECRET_KEY = "live_sk_GePWvyJnrKv0A2KMogWEVgLzN97E";

exports.confirmTossPayment = onRequest({ region: "asia-northeast3" }, (req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        const { paymentKey, orderId, amount } = req.body;

        try {
            // 시크릿 키 뒤에 콜론을 붙이고 Base64로 인코딩 (토스 필수 규칙)
            const encryptedSecretKey = Buffer.from(TOSS_SECRET_KEY + ":").toString("base64");

            // 토스 서버로 최종 승인 요청 보내기
            const response = await axios.post(
                "https://api.tosspayments.com/v1/payments/confirm",
                {
                    paymentKey: paymentKey,
                    orderId: orderId,
                    amount: amount
                },
                {
                    headers: {
                        Authorization: `Basic ${encryptedSecretKey}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // 결제 승인 성공 시 프론트엔드로 성공 신호 보내기
            res.status(200).json(response.data);
        } catch (error) {
            // 결제 승인 실패 시 에러 로그 남기기
            console.error("결제 승인 에러:", error.response ? error.response.data : error.message);
            res.status(400).json({ error: "결제 승인 실패" });
        }
    });
});