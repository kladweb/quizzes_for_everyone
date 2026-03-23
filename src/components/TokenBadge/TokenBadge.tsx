import React from "react";
import "./tokenBadge.css";

type ITokenBadgeProps = {
  remaining: number
  limit: number
  handlerToken?: () => void
}

export const TokenBadge: React.FC<ITokenBadgeProps> = ({remaining, limit, handlerToken}) => {

  return (
    <div className="token-badge-wrapper" title={`Осталось ${remaining} из ${limit} токенов`}>
      <span>⛃</span>
      <span>{remaining}</span>
    </div>
  );
}
