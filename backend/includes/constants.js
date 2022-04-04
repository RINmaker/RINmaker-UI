module.exports = Object.freeze({
    ERR: 'error',
    SUCC: 'success',
    INT_ERR: 'Internal error',
    PROCESS_SUCC: 'Processing completed successfully',
    FILE_NOT_EXIST: 'File does not exist',
    FILE_EXISTS: 'File exists',

    BAD_REQUEST_CODE: 400,
    NOT_FOUND_CODE: 404,
    SUCCESS_CODE: 200,
    INT_ERR_CODE: 500,

    PATH_TO_REDUCE: process.env.PATH_TO_REDUCE || './workdir/reduce',
    PATH_TO_RINMAKER: process.env.PATH_TO_REDUCE || './workdir/RINmaker',

    PATH_TO_INPUT: './workdir/input_pdb/',
    PATH_TO_REDUCEPDB: './workdir/reduced_pdb/',
    PATH_TO_LOG: './workdir/logs/',
    PATH_TO_OUTPUT: './workdir/output_xml/',
    FILE_LOG_NAME: 'main.txt',

    MAX_LIMIT: 20.0,
    MIN_SEQ_SEP: 3,
    MIN_H_BOND: 3.5,
    MIN_VDW_BOND: 0.5,
    MIN_IONIC_BOND: 4.0,
    MIN_GENERIC_BOND: 6.0,
    MIN_PICATION_BOND: 5.0,
    MIN_PIPISTACK_BOND: 6.5,

    BOND_CONTROL: ['strict','weak'],
    INTERACTION_TYPE: ['all','multiple','one'],
    NET_POLICY: ['closest','Ca','Cb'],

    MAX_MESSAGE: 'Enter positive Float less than 20',
    MAX_MESSAGE_UINT: 'Enter UINTs less than 20',
    MIN_MESSAGE: 'Enter positive Float greater than',
    MIN_MESSAGE_UINT: 'Enter UINTs greater than',
    NEGATIVE_ANGLE_MESSAGE: 'Enter a positive Number greater than 0',

    NOT_VALID_NAME: 'is not a valid file name',
    FILE_NAME_REQ: 'File name is required',
    NOT_VALID_NUM: 'not valid, only UINT are allowed',
    CONTENT_REQ: 'Content field is required'
});
