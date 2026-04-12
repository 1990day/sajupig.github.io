const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");

// 서버 위치를 기존 토스 함수와 똑같이 서울로 맞춥니다
setGlobalOptions({ region: "asia-northeast3" });

const TELEGRAM_BOT_TOKEN = "8635240411:AAGH2DQ9uSKA5BVdzfSVxzICG2u5LOzfwbU";
const TELEGRAM_CHAT_ID = "8481225024";

exports.sendPaymentNotification = onDocumentCreated(
  "users/{userId}/purchases/{purchaseId}",
  async (event) => {
    const purchaseData = event.data.data();
    
    const message = `[사주돼지] 앗! 새로운 결제가 발생했습니다!\n유저 ID: ${event.params.userId}`;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      });
      console.log("텔레그램 알림 발송 완료");
    } catch (error) {
      console.error("알림 쏘다가 에러 발생: ", error);
    }
  }
);