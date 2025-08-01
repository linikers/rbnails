import { Button, Col } from "reactstrap";
import { DaySchedule } from "./types";
import TimeSlotComponent from "./intervaloTempo";

interface DayColumnProps {
    daySchedule: DaySchedule;
    onAddSlot: (day: string) => void;
    onEditSlot: (day: string, slotId: string) => void;
    onDeleteSlot: (day: string, slotId: string) => void;
  }
const DayCollumn: React.FC<DayColumnProps> = ({
    daySchedule, 
    onAddSlot, 
    onEditSlot, 
    onDeleteSlot 
}) => {
    console.log(daySchedule.day);
    return (
        <Col md className="mb-3 mb-md-0">
            <div>
                <h5 className="mb-0">{daySchedule.day}</h5>
                <Button
                    size="sm" 
                    color="primary" 
                    className="btn-add-slot"
                    onClick={() => onAddSlot(daySchedule.day)}
                >
                    +
                </Button>
            </div>
            <div className="day-column">
                {daySchedule.slots
                    .slice()
                    .sort((a,b) => a.time.localeCompare(b.time))
                    .map((slot) => (
                        <TimeSlotComponent 
                            key={slot.id}
                            slot={slot}
                            onEdit={() => onEditSlot(daySchedule.day, slot.id)}
                            onDelete={() => onDeleteSlot(daySchedule.day, slot.id)}
                        />
                ))}
            </div>
        </Col>
    );
};

export default DayCollumn;