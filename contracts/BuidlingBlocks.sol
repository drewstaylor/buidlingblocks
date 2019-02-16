pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

contract BuidlingBlockInterface{
    enum AgeGroup {one,two,three}

    enum CourseStream {Math, Science, Reading}

      struct Teacher {
        string Name;
        address teacherAddress;
    }

    struct Student {
        string Name;
        AgeGroup ageGroup;
        address studentAddress;

    }


}

contract BuidlingBlocks is BuidlingBlockInterface {

    address[] teachers;
    address[] students;

    constructor() public {

    }

    function registerTeacher() public{

    }

    function registerStudent() public{

    }


    function launchCourse(AgeGroup _ageGroup, CourseStream _courseStream) public {

    }

}

contract Course is BuidlingBlockInterface{


    // hash correct answers
    string Name;

    AgeGroup ageGroup;
    CourseStream courseStream;
    Teacher teacher;

    step[] steps;
    Test[] tests;


    struct step {
        bytes32 textHash;
        bytes32 imageHash;

    }

    struct Test {
        string[] questions;
        bytes32[] answers;
        string[][] options;
        mapping(address => uint) testScores;
        address[] testTakers;
    }


    constructor (AgeGroup _ageGroup, CourseStream _courseStream) public{
        ageGroup = _ageGroup;
        courseStream = _courseStream;
    }
        //teachers

    function addStep(bytes32 textHash, bytes32 imageHash) public {
        uint stepIndex = steps.length;
        steps[stepIndex].textHash = textHash;
        steps[stepIndex].imageHash = imageHash;
    }

    function addSteps(bytes32[] memory textHashes, bytes32[] memory imageHashes) public {
        require(textHashes.length==imageHashes.length);
        for (uint i=0;i<imageHashes.length;i++){
            addStep(textHashes[i],imageHashes[i]);
        }
    }

    function addTest(string[] memory questionTexts, bytes32[] memory answers, string[][] memory options) public{
        uint testIndex = tests.length;
        tests[testIndex].questions = questionTexts;
        tests[testIndex].answers = answers;
        tests[testIndex].options = options;
    }
    
    function addQuestion(uint stepNumber, string memory questionText) internal {

    }

    function getStudentTestScore(uint testID, address student) public view returns(uint testScore){
        return tests[testID].testScores[student];
    }

    function getAllTestScores(uint testID) public view returns(uint[] memory testScores){
        uint[] memory allTestScores;
        for(uint i=0; i<tests[testID].testTakers.length;i++){
            address testTaker = tests[testID].testTakers[i];
            allTestScores[i] = tests[testID].testScores[testTaker];
        }
        return allTestScores;
    }

    //students
    function submitAnswers(bytes32[] memory answers) public{

    }

    function getTestScore(uint testID) public view returns (uint){

        return tests[testID].testScores[msg.sender];
    }

}
