interface Modem {
    modulate(data: any);
    demodulate(content: string);
    getData();
    clean();
}