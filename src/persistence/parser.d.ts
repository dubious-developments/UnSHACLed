interface Parser {
    serialize(data: any, mime: string, andThen: (result: any) => void);
    parse(content: string, mime: string, andThen: (result: string) => void);
    getData();
    clean();
}