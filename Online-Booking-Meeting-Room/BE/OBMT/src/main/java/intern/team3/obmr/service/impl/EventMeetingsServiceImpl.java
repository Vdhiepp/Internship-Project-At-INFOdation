package intern.team3.obmr.service.impl;

import intern.team3.obmr.domain.EventMeetings;
import intern.team3.obmr.domain.MeetingRooms;
import intern.team3.obmr.repository.EventMeetingsRepository;
import intern.team3.obmr.repository.MeetingRoomsRepository;
import intern.team3.obmr.service.EventMeetingsService;
import intern.team3.obmr.service.dto.EventMeetingsDTO;
import intern.team3.obmr.service.mapper.EventMeetingsMapper;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventMeetings}.
 */
@Service
@Transactional
public class EventMeetingsServiceImpl implements EventMeetingsService {

    private final Logger log = LoggerFactory.getLogger(EventMeetingsServiceImpl.class);

    private final EventMeetingsRepository eventMeetingsRepository;

    private final EventMeetingsMapper eventMeetingsMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public EventMeetingsServiceImpl(EventMeetingsRepository eventMeetingsRepository, EventMeetingsMapper eventMeetingsMapper) {
        this.eventMeetingsRepository = eventMeetingsRepository;
        this.eventMeetingsMapper = eventMeetingsMapper;
    }

    @Override
    public List<EventMeetingsDTO> findEventsByUsername(String username) {
        log.debug("Request to get Events for user with username: {}", username);
        List<EventMeetings> eventMeetings = eventMeetingsRepository.findEventsByUsername(username);
        return eventMeetings.stream()
            .map(eventMeetingsMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<EventMeetingsDTO> findAll() {
        log.debug("Request to get all EventMeetings");
        return eventMeetingsRepository.findAll()
            .stream()
            .map(eventMeetingsMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public void createEventAndAddUserToEvent(String title, LocalDateTime startTime, LocalDateTime endTime, String description, Long meetingRoomId) {
        // Lấy username hiện tại
        String username = getCurrentUsername();

        // Câu lệnh SQL để thêm một sự kiện mới
        String insertEventSql = "INSERT INTO event_meetings (title, start_time, end_time, description, created_at, updated_at, status, meeting_room_id) " +
            "VALUES (?, ?, ?, ?, NOW(), NOW(), 'WAITING', ?)";

        // Thực thi câu lệnh SQL để thêm sự kiện và lấy ID tự động sinh
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(insertEventSql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, title);
            ps.setTimestamp(2, Timestamp.valueOf(startTime));
            ps.setTimestamp(3, Timestamp.valueOf(endTime));
            ps.setString(4, description);
            ps.setLong(5, meetingRoomId);
            return ps;
        }, keyHolder); // Truyền keyHolder vào

        // Kiểm tra nếu có nhiều khóa trong keyHolder, lấy khóa đầu tiên
        List<Map<String, Object>> generatedKeys = keyHolder.getKeyList();
        if (generatedKeys != null && generatedKeys.size() == 1) {
            Long eventMeetingId = (Long) generatedKeys.get(0).get("id");

            // Câu lệnh SQL để thêm người dùng vào sự kiện vừa tạo
            String insertUserSql = "INSERT INTO event_users (is_organizer, appusers_id, event_meeting_id) " +
                "SELECT TRUE, id, ? FROM app_users WHERE username = ?";

            // Thực thi câu lệnh SQL để thêm người dùng vào sự kiện
            jdbcTemplate.update(insertUserSql, eventMeetingId, username);
        } else {
            // Xử lý nếu không có khóa hoặc có nhiều khóa
            throw new IllegalStateException("Unexpected number of generated keys.");
        }
    }


    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString(); // Trường hợp dùng token JWT hoặc custom principal
        }
    }

    @Override
    public EventMeetingsDTO save(EventMeetingsDTO eventMeetingsDTO) {
        log.debug("Request to save EventMeetings : {}", eventMeetingsDTO);
        EventMeetings eventMeetings = eventMeetingsMapper.toEntity(eventMeetingsDTO);
        eventMeetings = eventMeetingsRepository.save(eventMeetings);
        return eventMeetingsMapper.toDto(eventMeetings);
    }

    @Override
    public Optional<EventMeetingsDTO> partialUpdate(EventMeetingsDTO eventMeetingsDTO) {
        log.debug("Request to partially update EventMeetings : {}", eventMeetingsDTO);

        return eventMeetingsRepository
            .findById(eventMeetingsDTO.getId())
            .map(existingEventMeetings -> {
                eventMeetingsMapper.partialUpdate(existingEventMeetings, eventMeetingsDTO);

                return existingEventMeetings;
            })
            .map(eventMeetingsRepository::save)
            .map(eventMeetingsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventMeetingsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all EventMeetings");
        return eventMeetingsRepository.findAll(pageable).map(eventMeetingsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventMeetingsDTO> findOne(Long id) {
        log.debug("Request to get EventMeetings : {}", id);
        return eventMeetingsRepository.findById(id).map(eventMeetingsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventMeetings : {}", id);
        eventMeetingsRepository.deleteById(id);
    }
}
