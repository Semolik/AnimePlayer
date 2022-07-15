<script>
import axios from "axios";

export const HTTP = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});
</script>
