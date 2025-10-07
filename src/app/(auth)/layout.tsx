export const metadata = {
  title: "Austral CRM - Principal",
  description: "Interfaz principal de Austral CRM",
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
