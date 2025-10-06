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
      <h1>Hello Root and MetaData</h1>
    </div>
  );
}
