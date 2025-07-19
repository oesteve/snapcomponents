interface PriceDisplayProps {
    price: number;
    currency: string;
}

export default function PriceDisplay({ price, currency }: PriceDisplayProps) {
    // Define currency symbols and their positions
    const currencyMap: Record<
        string,
        { symbol: string; position: "before" | "after" }
    > = {
        USD: { symbol: "$", position: "before" },
        EUR: { symbol: "€", position: "after" },
        GBP: { symbol: "£", position: "before" },
        JPY: { symbol: "¥", position: "before" },
        CNY: { symbol: "¥", position: "before" },
        INR: { symbol: "₹", position: "before" },
        RUB: { symbol: "₽", position: "after" },
        BRL: { symbol: "R$", position: "before" },
        CAD: { symbol: "C$", position: "before" },
        AUD: { symbol: "A$", position: "before" },
    };

    // Get currency info or use default formatting
    const currencyInfo = currencyMap[currency] || {
        symbol: currency,
        position: "after",
    };

    // Format the price with the currency symbol in the correct position
    const formattedPrice =
        currencyInfo.position === "before"
            ? `${currencyInfo.symbol}${price}`
            : `${price}${currencyInfo.symbol}`;

    return (
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formattedPrice}
        </span>
    );
}
