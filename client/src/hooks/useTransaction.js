import { useState, useEffect, useCallback } from "react";
import { transactionsApi } from "../services/api/transaction.api";

export default function useTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetchTransactions = useCallback(() => {
    setLoading(true);
    return transactionsApi
      .getAll()
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refetchTransactions();
  }, [refetchTransactions]);

  return { transactions, setTransactions, loading, refetchTransactions };
}
