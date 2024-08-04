import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

interface BasicDatePickerProps {
  selectedDate: Dayjs | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs | undefined>>;
}

const BasicDatePicker: React.FC<BasicDatePickerProps> = ({ selectedDate, setSelectedDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label="Expiration Date"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue ?? undefined)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
