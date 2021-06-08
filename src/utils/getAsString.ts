
// handle url case:
// www.xxx.com?myparam=hello&myparam=hell02
// query.myparam=[hello, hello2]
export function getAsString(value: string | string[]): string {
    if(Array.isArray(value)) {
        return value[0];
    }
    return value;
 }