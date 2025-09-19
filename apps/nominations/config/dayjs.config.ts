import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(isoWeek);
dayjs.extend(updateLocale);

dayjs().locale("fr").format();

dayjs.updateLocale("fr", { weekStart: 1 });

export default dayjs;