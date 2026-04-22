export const formatName = (name: string) => {
    if(!name) return '';
    return name.toLowerCase().split(' ').join('_').replace('ñ', 'n');
}