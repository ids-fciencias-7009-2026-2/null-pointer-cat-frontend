/* 
 * It runs automatically when the route is accessed.
*/
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    removeToken(); 
    navigate("/login"); 
  }, [navigate]);

  return <p>Logging out</p>;
}