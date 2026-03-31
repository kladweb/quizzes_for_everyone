import React from "react";
import { useLimit, useLoading, useRemaining } from "../../store/useTokensStore";
import "./tokenBadge.css";

// type ITokenBadgeProps = {
//   remaining: number
//   limit: number
//   loading: boolean
//   handlerToken?: () => void
// }

export const TokenBadge: React.FC = () => {

  const remaining = useRemaining();
  const limit = useLimit();
  const loading = useLoading();

  return (
    <div className="token-badge-wrapper" title={`Осталось ${remaining} из ${limit} токенов`}>
      <span>⛃</span>
      <span>{!loading ? remaining : " ... "}</span>
    </div>
  );
}
