import React from "react";
import { useLimit, useLoadingTokens, useRemaining } from "../../store/useTokensStore";
import "./tokenBadge.css";

export const TokenBadge: React.FC = () => {
  const remaining = useRemaining();
  const limit = useLimit();
  const loading = useLoadingTokens();

  return (
    <div className="token-badge-wrapper" title={`Осталось ${remaining} из ${limit} токенов`}>
      <span>⛃</span>
      <span>{!loading ? remaining : " ... "}</span>
    </div>
  );
}
