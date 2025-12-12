import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/format";

interface ProductInfoProps {
  title: string;
  price: number | string;
  description: string | null;
  category?: string;
}

export function ProductInfo({
  title,
  price,
  description,
  category,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      {category && (
        <Badge className="w-fit border-2 border-black bg-yellow-300 font-bold text-black uppercase hover:bg-yellow-400">
          {category}
        </Badge>
      )}

      <h1 className="text-4xl font-extrabold tracking-tight text-black lg:text-5xl">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold bg-black text-white px-2 py-1">
          {formatRupiah(price)}
        </span>
      </div>

      <div className="prose prose-neutral max-w-none text-neutral-600">
        <p>{description}</p>
      </div>
    </div>
  );
}
