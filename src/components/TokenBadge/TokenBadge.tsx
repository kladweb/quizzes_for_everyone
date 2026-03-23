import React from "react";
import "./tokenBadge.css";

type ITokenBadgeProps = {
  remaining: number
  limit: number
  loading: boolean
  handlerToken?: () => void
}

export const TokenBadge: React.FC<ITokenBadgeProps> = ({remaining, limit, loading, handlerToken}) => {

  return (
    <div className="token-badge-wrapper" title={`Осталось ${remaining} из ${limit} токенов`}>
      <span>⛃</span>
      <span>{!loading ? remaining : " ... "}</span>
    </div>
  );
}
