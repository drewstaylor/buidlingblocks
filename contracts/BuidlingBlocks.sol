pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "./SteppingStones.sol";

contract BuidlingBlocksInterface{
    enum AgeGroup {PreSchool,Elementary,Secondary}

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

contract BuidlingBlocks is BuidlingBlocksInterface,SteppingStones {

    address[] public teachers;
    address[] public students;
    address[] public courses;

    mapping(address => bool) isTeacher;
    mapping(address => bool) isStudent;
    mapping(address => bool) isCourse;

    event teacherRegistered(address teacher);
    event studentRegistered(address student);
    event courseRegistered(address courseContract, address teacher);

    mapping(address => address[]) public coursesByTeacher;

    function registerTeacher() public{
        require(!isTeacher[msg.sender]);
        teachers.push(msg.sender);
        isTeacher[msg.sender]= true;
        emit teacherRegistered(msg.sender);
    }

    function registerStudent() public{
        require(!isStudent[msg.sender]);
        students.push(msg.sender);
        isStudent[msg.sender]= true;
        emit studentRegistered(msg.sender);
    }

    function launchCourse(AgeGroup _ageGroup, CourseStream _courseStream, bytes32 courseHash) public {

        Course c = new Course(_ageGroup,_courseStream, msg.sender,courseHash);
        courses.push(address(c));
        coursesByTeacher[msg.sender].push(address(c));

        isCourse[address(c)] == true;

        emit courseRegistered(address(c), msg.sender);
    }

     function getCoursesByTeacher(address teacher) public view returns(address[] memory courseList){
        return coursesByTeacher[teacher];
    }

    function getTeacher(uint index)  public view returns (address){
        return teachers[index];
    }

    function getStudent(uint index)  public view returns (address){
        return teachers[index];
    }

    function getCourse(uint index)  public view returns (address){
        return teachers[index];
    }

    function getTeacherLength() public view returns (uint){
        return teachers.length;
    }
      function getStudentsLength() public view returns (uint){
        return students.length;
    }
      function getCoursesLength() public view returns (uint){
        return courses.length;
    }



    //Stones
    event minting(address, uint);
    event burning(address, uint);

    function mint(address recipient, uint value) external {
        require(isCourse[msg.sender]);
        create(recipient,value);
    }

    function burn(address recipient, uint value) external {
        require(isCourse[msg.sender]);
        destroy(recipient,value);
    }

    //Verifiers



}

contract Course is BuidlingBlocksInterface{


    // hash correct answers
    string public Name;
    BuidlingBlocks BuidlingBlocksContract;

    AgeGroup ageGroup;
    CourseStream courseStream;
    address public teacher;

    bytes32 courseHash;

    constructor (AgeGroup _ageGroup, CourseStream _courseStream, address _teacher, bytes32 _courseHash) public{
        ageGroup = _ageGroup;
        courseStream = _courseStream;
        teacher = _teacher;
        BuidlingBlocksContract = BuidlingBlocks(msg.sender);

        courseHash = _courseHash;
    }
        //teachers

        bytes32[] answers;

        mapping(address => bytes32[]) responses;
        mapping(address => uint) testScores;
        address[] testTakers;

        mapping(address => bool) hasTakenTest;





    function getStudentTestScore(uint testID, address student) public view returns(uint testScore){
        return testScores[student];
    }

    function getAllTestScores(uint testID) public view returns(uint[] memory Scores){

    }

    //students
    function submitResponses(uint testID, bytes32[] memory _responses) public{
       require(_responses.length == answers.length);
       require(hasTakenTest[msg.sender]==false);
       responses[msg.sender] = _responses;

       for(uint i = 0; i<_responses.length;i++){
           if(_responses[i]==answers[i]){
               testScores[msg.sender]+=1;
           }
       }
       BuidlingBlocksContract.mint(msg.sender,testScores[msg.sender]);
    }

    function getTestScore(uint testID) public view returns (uint){
        return testScores[msg.sender];
    }



    //internal contract




    
}
