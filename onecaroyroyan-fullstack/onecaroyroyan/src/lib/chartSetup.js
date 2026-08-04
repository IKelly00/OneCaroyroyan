import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

/*
 * chartSetup.js
 * ------------------------------------------------------------------
 * The original app loaded the Chart.js UMD build from a <script> tag,
 * which registers everything globally. react-chartjs-2 uses the ESM
 * build, which is tree-shakeable — so we register only the pieces
 * this app actually uses (Line, Bar, Doughnut). Imported once, here,
 * from main.jsx.
 * ------------------------------------------------------------------
 */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);
