
function createTable(data, labels){
    var result = [];
    for(var i=0; i < labels.length; i++){
        var temp = [labels[i], data[i]];
        result.push(temp);

    }
    console.log(result);
    return result;
}

export const docDefinitionDefault = (
    pdbname,
    log,
    logo,
    num_links,
    num_nodes,
    res_list,
    bond_list,
    ext,
    hbond_ext_count,
    bond_count,
    res_count,
    avg_e_bond,
    avg_dist_bond,
    h_bond_chart_image,
    res_count_image,
    bonds_count_image,
    avg_e_type_image,
    avg_dist_type_image
) => {

    const bond_list1 = [...bond_list];
    const bond_list2 = [...bond_list];
    const bond_list3 = [...bond_list];


    const result =  {
        pageSize: "A4",
        pageOrientation: "portrait",
        pageMargins: [40, 60, 40, 60],
        content: [
            {
                image: logo,
                width: 150,
                alignment: "justify",
            },
            {
                text: "Report for " + pdbname,
                style: "header",
                alignment: "center"
            },
            {
                text: "# Nodes: " + num_nodes,
                style: "textBody",
                alignment: "justify"
            },
            {
                text: "# Links: " + num_links,
                style: "textBody",
                alignment: "justify",
                lineHeight: 2,
            },

            {
                text: "Log:",
                lineHeight: 2,
                style: {
                    fontSize: 12,
                    bold: true,
                },
                alignment: "justify",

            },
            {
                text: log,
                style: "textCode",
                alignment: "justify",
                lineHeight: 2,
            },
            {
                text: "Hydrogen bonds per type (in %)",
                style: "subheader",
                alignment: "center",
                pageBreak: "before",
                lineHeight: 2,
            },
            {
                image: h_bond_chart_image,
                width: 300,
                alignment: "center",
                margin: 5
            },
            {
                table: {
                    heights: 15,
                    body: [
                        ext,
                        hbond_ext_count,
                    ],
                },
                margin: 5
            },
            {
                text: "",
                lineHeight: 2,
            },
            {
                text: "Residue Count",
                style: "subheader",
                alignment: "center",
                lineHeight: 2,
            },
            {
                image: res_count_image,
                width: 400,
                alignment: "center",
                margin: 5
            },
            {
                table: {
                    heights: 15,
                    body: createTable(res_count, res_list),
                },
                margin: 5
            },

            {
                text: "Bonds Count",
                style: "subheader",
                alignment: "center",
                pageBreak: "before",
                lineHeight: 2,
            },
            {
                image: bonds_count_image,
                width: 300,
                alignment: "center",
                margin: 5
            },
            {
                table: {
                    heights: 15,
                    body: [
                        bond_list1,
                        bond_count,
                    ],
                },
                margin: 5
            },
            {
                text: "Average energy per type of bond (kj/mol)",
                style: "subheader",
                alignment: "center",
                lineHeight: 2,
            },
            {
                image: avg_e_type_image,
                width: 400,
                alignment: "center",
                margin: 5
            },
            {
                table: {
                    heights: 15,
                    body: [
                        bond_list2,
                        avg_e_bond,
                    ],
                },
                margin: 5
            },
            {
                text: "Average distance per type of bond",
                style: "subheader",
                alignment: "center",
                lineHeight: 2,
                pageBreak: "before",
            },
            {
                image: avg_dist_type_image,
                width: 400,
                alignment: "center",
                margin: 5
            },
            {
                table: {
                    heights: 15,
                    body: [
                        bond_list3,
                        avg_dist_bond,
                    ],
                },
                margin: 5
            },
        ],
        styles: {
            withMargin: {
                margin: [20, 20, 20, 20]
            },
            alignCenter: {
                alignment: "center"
            },
            header: {
                fontSize: 18,
                bold: true
            },
            textBody: {
                fontSize: 12
            },
            textCode: {
                fontSize: 11,

            },
            subheader: {
                fontSize: 15,
                bold: true
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            }
        }
    }

    return result;
};