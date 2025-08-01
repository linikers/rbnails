import { Row } from "reactstrap";
import { WeekSchedule } from "./types";
import DayCollumn from "./colunaDia";

interface WeekViewProps {
    weekSchedule: WeekSchedule;
    onAddSlot: (day: string) => void;
    onEditSlot: (day: string, slotId: string) => void;
    onDeleteSlot: (day: string, slotId: string) => void;
}
const WeekView: React.FC<WeekViewProps> = ({
    weekSchedule, 
    onAddSlot, 
    onEditSlot, 
    onDeleteSlot 
}) => {
    return (
        <Row className='week-view'>
                 {weekSchedule.days.map((day) => (
        <DayCollumn
          key={day.day}
          daySchedule={day}
          onAddSlot={onAddSlot}
          onEditSlot={onEditSlot}
          onDeleteSlot={onDeleteSlot}
        />
      ))} 
        </Row>
    );
};

export default WeekView;