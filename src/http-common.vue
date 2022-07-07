<script>
import axios from "axios";
console.log(import.meta.env.VITE_BASE_API_URL);
export const HTTP = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});
</script>
