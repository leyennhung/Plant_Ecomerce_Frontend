import mockData from "../../mocks/data/payment.json";
import styles from "./CheckoutPaymentFlow.module.css";

type BankPayment = {
    bank_name: string;
    account_number: string;
    payment_url: string;
};

type WalletPayment = {
    wallet_name: string;
    account_number: string;
    qr_code_url: string;
};

type PaymentInfo = BankPayment | WalletPayment;

interface Props {
    payment: "bank" | "wallet";
}

const CheckoutPaymentFlow = ({payment}: Props) => {
    const data: PaymentInfo = payment === "bank" ? mockData.vnpay : mockData.momo;

    return (
        <div className={styles.paymentBox}>
            <h3 className={styles.title}>Thông tin thanh toán</h3>

            {"bank_name" in data ? (
                <>
                    <p>
                        Ngân hàng: <b>{data.bank_name}</b>
                    </p>
                    <p>
                        Số tài khoản: <b>{data.account_number}</b>
                    </p>
                    <p>QR Code:</p>
                    <img
                        src={data.payment_url}
                        alt={`QR Code ${data.bank_name}`}
                        className={styles.qrCode}
                    />
                </>
            ) : (
                <>
                    <p>
                        Ví điện tử: <b>{data.wallet_name}</b>
                    </p>
                    <p>
                        Số ví: <b>{data.account_number}</b>
                    </p>
                    <p>QR Code:</p>
                    <img
                        src={data.qr_code_url}
                        alt={`QR Code ${data.wallet_name}`}
                        className={styles.qrCode}
                    />
                </>
            )}
        </div>
    );
};

export default CheckoutPaymentFlow;
