export function dateFormate (rowDate){
    let time_index = rowDate?.indexOf('T');
    let date = rowDate?.substring(0, time_index);
    // console.log(date);
    let time = rowDate?.substring(time_index+1, time_index+6);
    // console.log(rowTime);
    let date_time = date + ' | ' + time;
    return(date_time)
    
}