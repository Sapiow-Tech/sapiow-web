interface RevenueDisplayProps {
  amount: string;
  isLoading?: boolean;
}

export default function RevenueDisplay({
  amount,
  isLoading = false,
}: RevenueDisplayProps) {
  return (
    <div className="space-y-6 mb-2 md:mb-0">
      {isLoading ? (
        <div className="h-16 w-40 bg-gray-200 rounded-lg animate-pulse" />
      ) : (
        <div className="text-6xl font-bold text-cobalt-blue">{amount}</div>
      )}
    </div>
  );
}
