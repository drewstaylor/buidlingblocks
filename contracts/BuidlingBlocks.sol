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

    struct question {
        string questionText;
        bytes32 answer;
        string[] options;
    }

    struct Test {
        question[] questions;
        TestScore[] testScores;
        mapping(address => uint) testLocator;
    }

    struct TestScore {
        address student;
        uint score;
    }


    constructor (AgeGroup _ageGroup, CourseStream _courseStream) public{
        ageGroup = _ageGroup;
        courseStream = _courseStream;
    }
        //teachers

    function addStep(bytes32 textHash, bytes32 imageHash, string[] memory questionTexts, bytes32[] memory answers, string[][] memory options) public {

    }

    function addQuestion(uint stepNumber, string memory questionText) internal {

    }

    function getStudenTestScore(uint testID, address student) public view returns(uint testScore){
        uint testIndex = tests[testID].testLocator[student];
        return tests[testID].testScores[testIndex].score;
    }

    function getAllTestScores(uint testID) public view returns(TestScore[] memory testScores){

                return tests[testID].testScores;
    }

    //students
    function submitAnswers(bytes32[] memory answers) public{

    }

    function getTestScore(uint testID) public view returns (uint){
        uint testIndex = tests[testID].testLocator[msg.sender];
        return tests[testID].testScores[testIndex].score;
    }

}
