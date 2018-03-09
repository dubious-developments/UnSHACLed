interface Modem {
    getLabel();
    modulate(data: any, mime: string);
    demodulate(content: string, mime: string);
    getData();
    clean();
}