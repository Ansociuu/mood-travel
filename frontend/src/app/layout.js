import "./globals.css";

export const metadata = {
  title: "VietJourney - Đặt Tour & Homestay Cao Cấp",
  description: "Nền tảng đặt tour và homestay hàng đầu Việt Nam. Trải nghiệm thực, giá tốt nhất, hỗ trợ 24/7.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
