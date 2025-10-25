export const metadata = {
  title: "Austral | Broker Dashboard",
  description: "Panel de control para Brokers - Gestión de vendedores y comisiones",
};

export default function BrokersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}