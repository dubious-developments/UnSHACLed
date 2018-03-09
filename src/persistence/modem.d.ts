interface Modem {
    getLabel();
    modulate(data: any);
    demodulate(content: string);
    getData();
    clean();
}