import { useState, useEffect, useCallback } from "react";
import { customersApi } from "../services/api/customer.api";

export default function useCustomer() {
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetchCustomers = useCallback(() => {
    setLoading(true);
    return customersApi
      .getAll()
      .then((response) => {
        setCustomersData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refetchCustomers();
  }, [refetchCustomers]);

  return { customersData, setCustomersData, loading, refetchCustomers };
}
