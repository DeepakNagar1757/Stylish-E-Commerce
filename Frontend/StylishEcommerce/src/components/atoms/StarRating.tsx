import StarFilled from "@/src/assets/svg/ProductCard/star-filled.svg";
import StarHalf from "@/src/assets/svg/ProductCard/star-half.svg";
import StarOutline from "@/src/assets/svg/ProductCard/star-outline.svg";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < Math.floor(rating))
          return <StarFilled key={i} width={14} height={14} />;
        if (i < rating) return <StarHalf key={i} width={14} height={14} />;
        return <StarOutline key={i} width={14} height={14} />;
      })}
    </>
  );
};

export default StarRating;
