interface Parser {
    getLabel();
    serialize(data: any, mime: string);
    parse(content: string, mime: string);
    getData();
    clean();
}