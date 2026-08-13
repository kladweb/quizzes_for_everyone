import React from "react";
import { useLimit, useLoadingTokens, useRemaining } from "../../store/useTokensStore";
import "./tokenBadge.css";

interface ITokenBadgeProps {
  handlerClose: () => void;
}

export const TokenBadge: React.FC<ITokenBadgeProps> = ({handlerClose}) => {
  const remaining = useRemaining();
  const limit = useLimit();
  const loading = useLoadingTokens();

  return (
    <div
      className="token-badge-wrapper"
      title={`Ваш лимит ${limit} токенов в сутки. ${remaining > limit ? "Доступно" : "Остаток"} ${remaining}.`}
      onClick={handlerClose}
    >
      <span>⛃</span>
      <span>{!loading ? remaining : " ... "}</span>
    </div>
  );
}
