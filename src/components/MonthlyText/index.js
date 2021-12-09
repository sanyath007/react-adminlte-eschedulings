import React from 'react'

const monthName = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const MonthlyText = ({ monthText }) => {
    const [year, month] = monthText.split('-');

    return <span>{monthName[month]+ ' ' +(parseInt(year)+543)}</span>;
}

export default MonthlyText
