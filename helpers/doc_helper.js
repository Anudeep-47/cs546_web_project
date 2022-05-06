


const prepHomeDocs = (topDocs) => {
    topDocs.forEach(doc => {
        doc.doc_id = doc._id.toString();
        delete doc._id;
        doc.name = `${doc.firstname} ${doc.lastname}`;
    });
    return topDocs;
};



module.exports = {
    prepHomeDocs
};