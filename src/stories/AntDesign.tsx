import React, { useState } from "react";
import { DatePicker, Space, Select, Typography } from "antd";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "antd/dist/reset.css";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const AntDesign: React.FC = () => {
    const [rangeType, setRangeType] = useState<"date" | "week" | "month" | "year">("week");

    const getDefaultDates = (type: string) => {
        const now = dayjs("2025-02-03");


        if (type === "date") {
            return [now.subtract(8, "day"), now.subtract(1, "day")];
        } else if (type === "month") {
            // untuk bulan sebelumnya dan 4 bulan sebelumnya
            return [
                now.subtract(4, "month").startOf("month"), 
                now.subtract(1, "month").startOf("month"),  
            ];
        } else if (type === "week") {
            return [
                now.startOf("isoWeek").subtract(4, "week"),
                now.startOf("isoWeek").subtract(1, "week"),
            ];
        } else if (type === "year") {
            // return [now.subtract(3, "year").startOf("year"), now.startOf("year")];
            return [
                now.subtract(4, "year").startOf("year"), 
                now.subtract(1, "year").startOf("year"),  
            ];
        }
        return [now, now];
    };

    const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(
        getDefaultDates("week")
    );

    const handleRangeChange = (value: string) => {
        setRangeType(value as "date" | "week" | "month" | "year");
        setSelectedDates(getDefaultDates(value));
    };

    const handleDateChange = (dates: any) => {
        setSelectedDates(dates);
    };

    const formatValue = (date: dayjs.Dayjs, type: string) => {
        if (!date) return "";
        if (type === "week") return date.format("YYYY-[w]WW");
        if (type === "month") return date.format("YYYY-MM");
        if (type === "year") return date.format("YYYY");
        return date.format("YYYY-MM-DD");
    };

    return (
        <Space direction="vertical" size={12} align="center">
            <Space direction="horizontal" size={12} align="center">
                <Select value={rangeType} onChange={handleRangeChange} style={{ width: 150 }}>
                    <Option value="date">Daily</Option>
                    <Option value="week">Weekly</Option>
                    <Option value="month">Monthly</Option>
                    <Option value="year">Yearly</Option>
                </Select>

                <RangePicker
                    onChange={handleDateChange}
                    picker={rangeType}
                    value={selectedDates}
                    format={
                        rangeType === "week"
                            ? "YYYY-[w]WW"
                            : rangeType === "month"
                                ? "YYYY-MM"
                                : rangeType === "year"
                                    ? "YYYY"
                                    : "YYYY-MM-DD"
                    }
                />
            </Space>

            {selectedDates && (
                <Text strong>
                    Output: {formatValue(selectedDates[0], rangeType)} - {formatValue(selectedDates[1], rangeType)}
                </Text>
            )}
        </Space>
    );
};

export default AntDesign;
